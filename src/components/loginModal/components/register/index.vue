<!-- 注册 -->
<template>
	<div class="header">
		<p class="title">{{ $t('main.registerTips') }}</p>
		<!-- 立即登录 -->
		<span>
			<span class="login-hint">{{ $t('label.haveAccount') }}?</span>
			<ion-label class="login-text" @click="loginHandle">{{ $t('main.login') }}</ion-label>
		</span>
	</div>
	<!-- 注册方式选择器 -->
	<RegisterTypeSelector v-model="registerType" :type="OperationType.Register" />
	<div class="form-wrapper">
		<form ref="formRef" @submit="submitForm">
			<!-- 商户选择器 -->
			<TenantSelector></TenantSelector>
			<!-- 账号（手机号注册）-->
			<div class="item-height" v-if="registerType == LoginType.Phone">
				<Input v-model="registerParams.phoneNumber" type="phone" bgColor="--color-bg-400"
					:error-text="$t('hint.invalidPhone')" :placeholder="`${$t('label.phonePlaceholder')}`" required>
				</Input>
			</div>
			<!-- 账号（账号注册) -->
			<div class="item-height" v-else-if="registerType == LoginType.Account">
				<Input v-model="registerParams.username" type="account" bgColor="--color-bg-400"
					:error-text="$t('hint.invalidUsername')" :placeholder="$t('label.username')" clearInput required />
			</div>
			<!-- 密码 -->
			<div class="item-height">
				<Input v-model="registerParams.password" type="password" bgColor="--color-bg-400"
					:error-text="$t('hint.invalidPassword')" :placeholder="`${$t('label.password')}`" required
					autocomplete="new-password">
				</Input>
			</div>
			<!-- 确认密码 -->
			<div class="item-height">
				<Input v-model="confirmPassword" type="password" bgColor="--color-bg-400"
					:error-text="$t('hint.invalidPassword')" :placeholder="`${$t('label.confirmPassword')}`" required>
				</Input>
			</div>
			<!-- CPF -->
			<template v-if="showCpfInput">
				<div class="item-height">
					<Input v-model="cpfValue" type="cpf" :minlength="11" :maxlength="11" bgColor="--color-bg-400"
						:placeholder="`${$t('hint.tipCPF')}`" :error-text="$t('hint.invalidCPF')" required>
					</Input>
				</div>
				<div class="item-height" v-if="showRealNameInput">
					<Input ref="realNameInputRef" v-model.trim="registerParams.realName" type="realName" :noTrim="true"
						bgColor="--color-bg-400" :placeholder="$t('hint.realName')" :error-text="$t('hint.correctInformation')"
						:maxlength="REAL_NAME_LEN" :clear="true" required />
				</div>
				<div class="item-height" v-if="showBirthdayInput">
					<DatetimeInput ref="birthdayInputRef" v-model="registerParams.birthday" type="datetime" :disabled="true"
						:placeholder="$t('hint.birthday')" :error-text="$t('hint.correctInformation')" required>
						<ion-icon class="before-icon" slot="start" src="/svg/login/calendar.svg" />
					</DatetimeInput>
				</div>
			</template>
			<!-- 越南地区注册是否需要绑定真实姓名 -->
			<div class="item-height" v-if="needRealName">
				<Input ref="realNameInputRef" v-model.trim="registerParams.realName" type="realName" :noTrim="true"
					bgColor="--color-bg-400" :placeholder="$t('hint.realName')" :error-text="$t('hint.correctInformation')"
					:maxlength="REAL_NAME_LEN" :clear="true" required />
			</div>
			<!-- 手机号 -->
			<div class="item-height" v-if="registerType == LoginType.Account && authInfo?.accountRegisterShowPhone">
				<Input v-model="registerParams.phoneNumber" type="phone" bgColor="--color-bg-400"
					:error-text="$t('hint.invalidPhone')" :required="authInfo?.accountRegisterPhoneRequired"
					:placeholder="`${$t('label.phonePlaceholder')}`">
				</Input>
			</div>
			<!-- 验证码 -->
			<div class="item-height" v-if="showCaptchaInput">
				<Input v-model="registerParams.otp" :loading="loading" type="captcha" bgColor="--color-bg-400"
					:verifySended="verifySended" :countdown="countdown" :verifyHandle="verifyHandle"
					:error-text="$t('hint.invalidVerifyCode')" :placeholder="$t('label.verifyCode')" required>
				</Input>
			</div>
			<!-- cf人机验证 -->
			<div class="w-full overflow-hidden">
				<div id="cf-turnstile-register"></div>
			</div>
			<!-- 阿里云图形验证 -->
			<div id="captcha-element"></div>
			<div id="captcha-button"></div>
			<!-- 同意信息 -->
			<div class="flex text-[10px] text-[#A0A6B0] mb-[20px]" v-if="!agree">
				<ion-checkbox mode="md" v-model="agree" slot="start" aria-label="Label" label-placement="end" />
				<span class="ml-1">{{ $t("label.acceptProtocol") }}</span>
			</div>
			<!-- 注册按钮 -->
			<div class="submit register-btn-warpper mb-[1rem]">
				<RewardTag class="rewardTag" size="large"></RewardTag>
				<Button type="submit" :disabled="disabledBtn">
					{{ $t("main.register") }}
				</Button>
			</div>
		</form>
		<!-- 第三方登录 -->
		<ThirdPartyAuth class="footer" />
	</div>

</template>

<script setup lang="ts">
import { IonCheckbox, IonLabel, IonIcon } from "@ionic/vue";
import TenantSelector from "@/components/loginModal/components/tenantSelector/index.vue";
import RegisterTypeSelector from "@/components/loginModal/components/typeSelector/index.vue";
import ThirdPartyAuth from "@/components/loginModal/components/thirdPartyAuth/index.vue";
import Input from "@/components/first/Input/index.vue";
import RewardTag from "@/components/registerReward/RewardTag.vue";
import { OperationType, LoginType } from "@/enums/common";
import useRegisterLogic from "@/components/loginModal/registerLogic";
import useGetButton from "@/hooks/useGetButton";
import { REAL_NAME_LEN } from '@/views/withdraw/constant';
import DatetimeInput from "@/components/Input/index.vue";


const emit = defineEmits(["toggle"]); // 定义传递事件方法: 注册

const Button = useGetButton();

const {
	realNameInputRef,
	showBirthdayInput,
	showRealNameInput,
	birthdayInputRef,
	disabledBtn,
	formRef,
	agree,
	countdown,
	loading,
	verifySended,
	confirmPassword,
	authInfo,
	registerParams,
	verifyHandle,
	loginHandle,
	submitForm,
	registerType,
	showCaptchaInput,
	cpfValue,
	showCpfInput,
	needRealName,
} = useRegisterLogic({ emit });

</script>

<style scoped lang="less">
@import "@/components/loginModal/styles/register/index-base.less";
@import "@/components/loginModal/styles/register/theme-style.less";

.yellow-dark {
	#components-loginModal-components-register-index.style();
}

.green-dark {
	#components-loginModal-components-register-index.style();
}

.purple-light {
	#components-loginModal-components-register-index.style();
}

.green-default,
.green-v01,
.green-v02 {
	#components-loginModal-components-register-index.style(var(--color-text-gray-100);
		#6691D5;
		var(--color-text-gray-100);
	);
}

.forest-green {
	#components-loginModal-components-register-index.style(var(--color-text-gray-100);
		#EEF93B;
		var(--color-text-gray-100);
	);
}

.blue-default {
	#components-loginModal-components-register-index.style(var(--color-text-40);
		var(--accent-color-yellow);
	);
}

.auroral-yellow {
	#components-loginModal-components-register-index.style(var(--color-text-40);
		var(--text-color1);
	);
}

.amber-purple {
	.default {
		#components-loginModal-components-register-index.style(@--login-text-color: var(--accent-color-green-2);
		);
	}
}

.amber-purple {
	#components-loginModal-components-register-index.style(var(--text-color-light-purple-2-100);
		var(--accent-color-yellow);
		var(--text-color-light-purple-1-100);
	);
}

// new skin defult
#components-loginModal-components-register-index.style(
	@--color-text-40: var(--ep-color-text-weaker);
	@--login-text-color: var(--ep-color-text-highlight);
	@--title-text-color: var(--ep-color-text-default);
	@--font-weight-bold: var(--ep-font-weight-bold);
	@--font-weight-regular: var(--ep-font-weight-regular);
);
</style>
