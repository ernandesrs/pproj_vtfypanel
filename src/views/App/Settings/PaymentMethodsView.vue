<template>
	<loading-elem v-if="loadingContent"></loading-elem>
	<template v-else>
		<actions-bar bar-title="Métodos de pagamento"></actions-bar>
		<v-sheet class="px-10 py-8" v-resize="methodWindowResized">
			<v-row>
				<v-col cols="12" md="4" lg="3">
					<v-tabs v-model="paymentMethods.configTabs.current" :direction="paymentMethods.configTabs.direction"
						color="primary">
						<v-tab value="general">
							Geral
						</v-tab>
						<v-tab value="cards">
							Cartões
						</v-tab>
					</v-tabs>
				</v-col>

				<v-col cols="12" md="8" lg="9">
					<v-window v-model="paymentMethods.configTabs.current" class="w-100">
						<v-window-item value="general">
							<v-card variant="flat">
								<v-card-item>

									<v-select v-model="paymentMethods.form.data.method_preferred" label="Forma de pagamento preferencial"
										:items="(Object.entries(paymentMethods.methods)).map((method) => {
											return {
												value: method[0],
												text: method[1]
											}
										})" item-title="text" item-value="value"
										:error-message="paymentMethods.form.errors?.method_preferred"></v-select>

									<v-select v-model="paymentMethods.form.data.preferred_card_id" label="Cartão preferencial" :items="paymentMethods.form.data.cards.map((card) => {
										return {
											value: card.id,
											text: '[Final ' + card.last_digits + '] ' + card.name
										}
									})" item-title="text" item-value="value"
										:error-message="paymentMethods.form.errors?.preferred_card_id"></v-select>

								</v-card-item>
								<v-card-item class="text-center">
									<v-btn @click.stop="methodUpdatePaymentMethod" prepend-icon="mdi-check" text="Atualizar" color="primary"
										:loading="paymentMethods.form.submitting" :disabled="paymentMethods.form.submitting"></v-btn>
								</v-card-item>
							</v-card>
						</v-window-item>
						<v-window-item value="cards">
							<v-card variant="flat">
								<v-card-title>
									Seus cartões
								</v-card-title>
								<v-card-item class="mb-5">
									<v-row justify="center">
										<template v-if="paymentMethods.form.data.cards.length">
											<v-col v-for="theCard in paymentMethods.form.data.cards" :key="theCard.id" cols="12" sm="6" xl="4"
												class="py-5">
												<div class="mb-4"><span class="font-weight-medium">Nome do cartão:</span> {{
													theCard.name }}</div>
												<v-card :elevation="card.form.data?.id == theCard.id ? 4 : 2" border @click.stop="methodEditCard"
													:data-identificator="theCard.id" class="card-card"
													:color="card.form.data?.id == theCard.id ? 'primary' : ''">
													<v-card-item>
														<div class="d-none">
															<tiny-text-elem text="Nome do cartão" size="small" muted></tiny-text-elem>
															<p class="text-h7">{{ theCard.name }}</p>
														</div>
														<div>
															<tiny-text-elem text="Número do cartão" size="small" muted></tiny-text-elem>
															<p class="text-h7">{{ theCard.secure_number }}</p>
														</div>
														<div class="d-flex justify-between">
															<div>
																<tiny-text-elem text="Bandeira" size="small" muted></tiny-text-elem>
																<p class="text-h7">{{ theCard.brand.toUpperCase() }}</p>
															</div>

															<div class="mx-6">
																<tiny-text-elem text="Validade" size="small" muted></tiny-text-elem>
																<p class="text-h7">{{ theCard.expiration_date }}</p>
															</div>

															<div>
																<tiny-text-elem text="CVV" size="small" muted></tiny-text-elem>
																<p class="text-h6">{{ theCard.secure_cvv }}</p>
															</div>
														</div>
													</v-card-item>
												</v-card>
												<div v-if="card.form.data?.id == theCard.id" class="text-center">
													<confirmation-button icon="mdi-trash-can-outline" text="Excluir" variant="text" size="small"
														color="danger" dialog-title="Excluir cartão selecionado?"
														:confirm-callback="methodDeleteCardConfirmed"></confirmation-button>
												</div>
											</v-col>
										</template>
										<template v-else>
											<v-col class="text-center text-blue-grey-lighten-1">
												<p class="text-h6 py-6 border">Nenhum cartão cadastrado</p>
											</v-col>
										</template>
									</v-row>
								</v-card-item>
								<v-card-title>
									{{ card.form.data?.id ? 'Atualizar' : 'Cadastrar' }} cartão
								</v-card-title>
								<v-card-item>
									<v-row justify="center">
										<v-col cols="12" lg="8">
											<card-form v-model="card.form.data" :errors="card.form.errors"></card-form>
										</v-col>

										<v-col cols="12" lg="8" class="text-center">
											<v-btn @click.stop="card.form.data = {}" prepend-icon="mdi-close" text="Limpar" color="danger"
												class="mx-1" :disabled="card.form.submitting || !card.form.data?.id"></v-btn>
											<v-btn @click.stop="methodSaveCard" prepend-icon="mdi-check"
												:text="card.form.data?.id ? 'Atualizar' : 'Cadastrar'" color="primary"
												:loading="card.form.submitting" :disabled="card.form.submitting" class="mx-1"></v-btn>
										</v-col>
									</v-row>
								</v-card-item>
							</v-card>
						</v-window-item>
					</v-window>
				</v-col>
			</v-row>
		</v-sheet>
	</template>
</template>

<script>

import { useAppStore } from '@/store/app';
import axios from '@/plugins/axios';
import alert from '@/services/alert';
import LoadingElem from '@/components/LoadingElem.vue';
import ActionsBar from '@/components/ActionsBar.vue';
import TinyTextElem from '@/components/TinyTextElem.vue';
import ConfirmationButton from '@/components/ConfirmationButton.vue';
import CardForm from './CardForm.vue';

export default {
	components: { LoadingElem, ActionsBar, TinyTextElem, ConfirmationButton, CardForm },
	data() {
		return {
			loadingContent: true,
			card: {
				form: {
					submitting: false,
					data: {},
					errors: {}
				}
			},
			paymentMethods: {
				methods: {
					'undefined': 'Não definir',
					'credit_card': 'Cartão de crédito',
					'debit_card': 'Cartão de débito',
				},
				configTabs: {
					current: 'general',
					direction: 'horizontal'
				},
				form: {
					valid: false,
					data: {},
					submitting: false
				}
			}
		};
	},
	created() {
		useAppStore().updateBreadcrumbs([
			{
				title: 'Home',
				disabled: false,
				to: { name: 'app.home' }
			},
			{
				title: 'Configurações',
				disabled: true,
				to: { name: 'app.home' }
			},
			{
				title: 'Pagamentos',
				disabled: true,
				to: { name: 'app.paymentMethods' }
			}
		]);

		this.methodGetPaymentMethods();
	},
	methods: {
		methodGetPaymentMethods() {
			return axios.req({
				action: '/dash/payment-methods',
				method: 'get',
				success: (resp) => {
					this.paymentMethods.form.data = resp.data.payment_methods;
				},
				finally: () => {
					this.loadingContent = false;
				}
			});
		},
		methodUpdatePaymentMethod() {
			this.paymentMethods.form.submitting = true;

			return axios.req({
				action: '/dash/payment-methods',
				method: 'put',
				data: {
					'method_preferred': this.paymentMethods.form.data.method_preferred,
					'preferred_card_id': this.paymentMethods.form.data.preferred_card_id
				},
				success: (resp) => {
					alert.add('As configurações de suas formas de pagamento foram atualizadas!', 'info', 'Atualizado!');
					this.paymentMethods.form.data = resp.data.payment_method;
				},
				finally: () => {
					this.paymentMethods.form.submitting = false;
				}
			});
		},
		methodWindowResized() {
			if (window.innerWidth <= 960) {
				this.paymentMethods.configTabs.direction = 'horizontal';
			} else {
				this.paymentMethods.configTabs.direction = 'vertical';
			}
		},
		methodEditCard(event) {
			let cardId = event.target.getAttribute('data-identificator');

			this.card.form.errors = {};

			if (this.card.form.data?.id == cardId) {
				this.card.form.data = {};
				return;
			}

			this.card.form.data = this.paymentMethods.form.data.cards.find((card) => {
				return card.id == cardId;
			})
		},
		methodSaveCard() {
			let creating = this.card.form.data?.id ? false : true;
			let action = creating ? '/dash/payment-methods/cards' : '/dash/payment-methods/cards/' + this.card.form.data.id;
			let method = creating ? 'post' : 'put';

			this.card.form.submitting = true;
			return axios.req({
				action: action,
				method: method,
				data: {
					name: this.card.form.data.name,
					number: this.card.form.data.secure_number,
					cvv: this.card.form.data.secure_cvv,
					holder_name: this.card.form.data.holder_name,
					expiration_date: this.card.form.data.expiration_date,
				},
				success: (resp) => {
					alert.add(creating ? 'Novo cartão cadastrado!' : 'Cartão atualizado com sucesso!', creating ? 'success' : 'info', creating ? 'Cadastrado!' : 'Atualizado!');

					if (creating) {
						this.paymentMethods.form.data.cards.unshift(resp.data.card);
					}
				},
				fail: (resp) => {
					this.card.form.errors = resp.response?.data?.errors;
				},
				finally: () => {
					this.card.form.submitting = false;
				}
			});
		},
		methodDeleteCardConfirmed() {
			return axios.req({
				action: '/dash/payment-methods/cards/' + this.card.form.data.id,
				method: 'delete',
				success: () => {
					let removeIndex = this.paymentMethods.form.data.cards.findIndex((card) => {
						return card == this.card.form.data.id;
					});

					this.paymentMethods.form.data.cards.splice(removeIndex, 1);
					this.card.form.data = {};

					alert.add('Cartão excluído com sucesso!', 'warning', 'Excluído!');
				}
			});
		}
	}
}

</script>

<style>
.card-card>* {
	pointer-events: none;
}
</style>