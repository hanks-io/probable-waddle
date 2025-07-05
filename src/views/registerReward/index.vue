<!-- 助力领现金 -->
<template>
	<ion-page>
		<ion-content>
			<component :is="template" />
		</ion-content>
	</ion-page>
</template>

<script setup lang="ts">
import { useComponents } from '@/views/registerReward/logic';
import { IonPage, IonContent } from '@ionic/vue';
const template = useComponents();
</script>
