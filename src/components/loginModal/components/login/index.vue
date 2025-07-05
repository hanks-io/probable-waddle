<!-- 登录 -->
<template>
	<div class="header">
		<p class="title">{{ $t('main.loginTips') }}</p>
		<!-- 立即注册 -->
		<span>
			<span class="register-hint">{{ $t('label.noAccount') }}?</span>
			<ion-label class="register-text" @click="registerHandle">{{ $t('main.register') }}</ion-label>
			<RewardTag style="display: inline-block; padding-left: 0.3125rem"></RewardTag>
		</span>
		<!-- 账户异常提示 -->
		<p v-if="accountStatus === AccountStatus.OFFLINE" class="exception-text">{{ $t('popup.tips10') }}</p>
		<p v-else-if="accountStatus === AccountStatus.FROZEN" class="exception-text">{{ $t('popup.tips09') }}</p>
	</div>
	<!-- 登录方式选择器 -->
	<LoginTypeSelector v-model="loginType" :type="OperationType.Login" />
	<div class="form-wrapper">
		<form ref="formRef" class="pb-[0.9375rem]" autocomplete="off" @submit="submitForm">
			<!-- 商户选择器 -->
			<TenantSelector />
			<!-- 账号（手机号登录） -->
			<div class="item-height" v-if="loginType === LoginType.Phone">
				<Input ref="phoneRef" v-model="loginParams.username" type="phone" bgColor="--color-bg-400"
					:error-text="$t('hint.invalidPhone')" :placeholder="`${$t('label.phonePlaceholder')}`" clearInput required
					name="username" autocomplete="username">
				</Input>
			</div>
			<!-- 账号（账号登录） -->
			<div class="item-height" v-if="loginType === LoginType.Account">
				<Input ref="usernameRef" v-model="loginParams.username" type="account" bgColor="--color-bg-400"
					:error-text="$t('hint.invalidUsername')" :placeholder="`${$t('label.username')}`" clearInput required
					name="username" autocomplete="username">
				</Input>
			</div>
			<!-- 密码 -->
			<div class="item-height">
				<Input ref="passwordRef" v-model="loginParams.password" type="password" bgColor="--color-bg-400"
					:error-text="$t('hint.invalidPassword')" :placeholder="`${$t('label.password')}`" clearInput required
					autocomplete="current-password" errorHeight="1.25rem">
				</Input>
			</div>
			<!-- cf人机验证 -->
			<div class="w-full overflow-hidden">
				<div id="cf-turnstile-login"></div>
			</div>
			<!-- 阿里云图形验证 -->
			<div id="captcha-element"></div>
			<div id="captcha-button"></div>
			<!-- 是否记住账号密码 -->
			<div class="remember-account">
				<ion-checkbox mode="md" v-model="remember" slot="start" aria-label="Label" label-placement="end" />
				<span class="text-warpper">
					<span>{{ $t('label.rememberAccount') }}</span>
					<span @click="forgetHandle">{{ $t('label.forgotPassword') }}?</span>
				</span>
			</div>
			<!-- 登陆按钮 -->
			<div class="btn-login">
				<Button type="submit" :disabled="disabledBtn" :suffixLoading="btnLoading">{{ $t('main.login') }}</Button>
			</div>
		</form>
		<!-- 第三方登录 -->
		<ThirdPartyAuth class="footer" />
	</div>

</template>

<script setup lang="ts">
import { IonCheckbox, IonLabel } from "@ionic/vue";
import TenantSelector from "@/components/loginModal/components/tenantSelector/index.vue";
import LoginTypeSelector from "@/components/loginModal/components/typeSelector/index.vue";
import ThirdPartyAuth from "@/components/loginModal/components/thirdPartyAuth/index.vue";
import Input from "@/components/first/Input/index.vue";
import { LoginType, OperationType, AccountStatus } from "@/enums/common";
import useLoginLogic from "@/components/loginModal/loginLogic";
import useGetButton from "@/hooks/useGetButton";
import RewardTag from "@/components/registerReward/RewardTag.vue";

const emit = defineEmits(["toggle"]); // 定义传递事件方法: 注册

const Button = useGetButton();

const {
	disabledBtn,
	btnLoading,
	formRef,
	phoneRef,
	passwordRef,
	loginParams,
	remember,
	registerHandle,
	forgetHandle,
	submitForm,
	loginType,
	accountStatus,
} = useLoginLogic({ emit });

</script>

<style scoped lang="less">
@import "@/components/loginModal/styles/login/index-base.less";
@import "@/components/loginModal/styles/login/theme-style.less";

.yellow-dark {
	#components-loginModal-components-login-index.style(
		#6691D5;
	);
}

.green-dark {
	#components-loginModal-components-login-index.style();
}

.purple-light {
	#components-loginModal-components-login-index.style();
}

.green-default,
.green-v01,
.green-v02 {
	#components-loginModal-components-login-index.style(
		#6691D5;
		var(--color-text-gray-100);
		var(--color-text-gray-100);
		var(--color-text-gray-100);
	);
}

.forest-green {
	#components-loginModal-components-login-index.style(
		#EEF93B;
		var(--color-text-gray-100);
		var(--color-text-gray-100);
		var(--color-text-gray-100);
	);
}

.blue-default {
	#components-loginModal-components-login-index.style(
		var(--accent-color-yellow);
		var(--color-text-40);
		var(--color-text-100);
		var(--color-text-40);
	);
}

.auroral-yellow {
	#components-loginModal-components-login-index.style(
		var(--text-color1);
		var(--color-text-40);
		var(--color-text-100);
		var(--color-text-40);
	);
}

.amber-purple {
	.default {
		#components-loginModal-components-login-index.style(
			@--register-text-color: var(--accent-color-orange-3);
		);
	}
}

.amber-purple {
	#components-loginModal-components-login-index.style(
		var(--accent-color-yellow);
		var(--text-color-light-purple-2-100);
		var(--text-color-light-purple-1-100);
		var(--text-color-light-purple-2-100);
	);
}

// new skin defult
#components-loginModal-components-login-index.style(
	@--title-text-color: var(--ep-color-text-default);
	@--color-text-40: var(--ep-color-text-weaker);
	@--register-text-color: var(--ep-color-text-highlight);
	@--font-weight-bold:var(--ep-font-weight-bold);
);
</style>
