<template>
    <v-form v-model="valid">
        <v-row>
            <template v-for="field, key in fields" :key="key">
                <v-col cols="12" :sm="field?.sizes?.sm" :md="field?.sizes?.md" :lg="field?.sizes?.lg" :xl="field?.sizes?.xl">
                    <v-text-field v-if="['text', 'number', 'email', 'password'].includes(field.type)"
                        v-model="fdata[field.vModel]" :label="field.label"
                        :error-messages="errors[field.vModel]"></v-text-field>
                    <v-select v-else-if="['select'].includes(field.type)" :items="field.items" v-model="fdata[field.vModel]"
                        item-title="text" item-value="value" :label="field.label"
                        :error-messages="errors[field.vModel]"></v-select>
                </v-col>
            </template>
            <v-col cols="12" class="text-center">
                <v-btn @click.stop="method_submitFormButtonClick" prepend-icon="mdi-check" :text="submitButton.text"
                    color="primary" :loading="submitting"></v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script>

import axios from '@/plugins/axios';
import alert from '@/services/alert';

export default {
    data() {
        return {
            valid: false,
            fdata: this.data,
            errors: {},
            submitting: false
        }
    },
    emits: {
        'submitForm': null
    },
    props: {
        data: {
            type: [Object],
            default: Object
        },
        /**
         * 
         * input text object example
         * {
         *      type: 'text',
         *      label: 'First name',
         *      vModel: 'first_name'
         *      sizes: {
         *          sm: 6,
         *          md: 4
         *      }
         * }
         * 
         * input select object example
         * {
         *      type: 'select',
         *      label: 'Gender',
         *      vModel: 'gender'
         *      sizes: {
         *          sm: 6,
         *          md: 4
         *      },
         *      items: [
         *          {
         *              text: 'Male',
         *              value: 'm'
         *          },
         *          {
         *              text: 'Female',
         *              value: 'f'
         *          },
         *          {
         *              text: 'Not define',
         *              value: 'n'
         *          }
         *      ]
         * }
         * 
         */
        fields: {
            type: [Array],
            default: Array
        },
        submitButton: {
            type: Object,
            default: Object
        },
        /**
         * 
         * Example #1:
         * {
         *      action: '/me/update',
         *      method: 'put',
         *      except: ['username'], // optional
         *      // optional
         *      success: {
         *          title: 'Updated!',
         *          message: 'Your profile has been updated'
         *      },
         *      // optional
         *      redirect: {
         *          success: 'route name here',
         *          fail: 'route name here'
         *      } 
         * }
         * 
         * Example #2:
         * {
         *      action: '/me/update',
         *      method: 'put',
         *      only: ['first_name', 'last_name', 'username'], // optional
         *      // optional
         *      success: {
         *          title: 'Updated!',
         *          message: 'Your profile has been updated'
         *      },
         *      // optional
         *      redirect: {
         *          success: 'route name here',
         *          fail: 'route name here'
         *      } 
         * }
         */
        submitOptions: {
            type: Object,
            default: Object
        }
    },
    methods: {
        method_submitFormButtonClick(e) {
            if (!this.submitOptions?.action) {
                this.$emit('submitForm', e);
                return;
            }

            this.submitting = true;

            axios.req({
                action: this.submitOptions.action,
                method: this.submitOptions.method,
                data: this.method_getFormData(),
                success: (resp) => {
                    const successRedirect = this.submitOptions?.redirect?.success ?? null;

                    if (resp.data?.success) {
                        alert.addSuccess(
                            this.submitOptions.success?.message ?? 'Formulário enviado!',
                            this.submitOptions.success?.title ?? 'Enviado!',
                            successRedirect ? true : false
                        );

                        this.errors = {};

                        if (successRedirect) {
                            this.$router.push({
                                name: successRedirect
                            });
                        }
                    }
                },
                fail: (resp) => {
                    const failRedirect = this.submitOptions?.redirect?.fail ?? null;

                    this.errors = resp.response?.data?.errors ?? {};

                    if (failRedirect) {
                        const error = resp.response?.data?.error;

                        alert.addError(
                            error,
                            failRedirect ? true : false
                        );

                        this.$router.push({
                            name: failRedirect
                        });
                    }
                },
                finally: () => {
                    this.submitting = false;
                }
            });
        },
        method_getFormData() {
            let sendableData = {};

            if (this.submitOptions?.only) {
                this.submitOptions.only.map((onl) => {
                    sendableData[onl] = this.fdata[onl];
                });
            } else if (this.submitOptions?.except) {
                sendableData = this.fdata;
                this.submitOptions.except.map((expt) => {
                    delete sendableData[expt];
                });
            } else {
                sendableData = this.fdata;
            }

            return sendableData;
        }
    }
}

</script>
