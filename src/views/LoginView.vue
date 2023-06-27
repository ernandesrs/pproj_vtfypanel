<template>
    <v-row class="justify-center">
        <v-col cols="4">
            <v-card>
                <v-card-title>
                    Login
                </v-card-title>
                <v-card-text>
                    <v-form v-model="formLogin.valid">
                        <v-text-field v-model="formLogin.data.email" :rules="formLogin.rules.emailRules"
                            label="Email:"></v-text-field>
                        <v-text-field type="password" v-model="formLogin.data.password"
                            :rules="formLogin.rules.passwordRules" label="Senha:"></v-text-field>

                        <div class="py-3 text-center">
                            <v-btn @click.stop="methodLogin" color="primary" :loading="formLogin.submitting">Login</v-btn>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>

import token from '@/services/token';
import axios from '@/plugins/axios';
import { useAppStore } from '@/store/app';

export default {
    data() {
        return {
            formLogin: {
                valid: false,
                data: {
                    email: null,
                    password: null
                },
                rules: {
                    emailRules: [
                        value => {
                            if (value && value.toString().length > 0) {
                                return true;
                            }
                            return 'Obrigatório';
                        }
                    ],
                    passwordRules: [
                        value => {
                            if (value && value.toString().length > 0) {
                                return true;
                            }
                            return 'Obrigatório';
                        }
                    ]
                },
                errors: {},
                submitting: false
            }
        };
    },
    methods: {
        methodLogin() {
            if (!this.formLogin.valid) {
                return;
            }

            axios.req({
                action: '/auth/login',
                method: 'post',
                data: {
                    email: this.formLogin.data.email,
                    password: this.formLogin.data.password,
                },
                success: (resp) => {
                    if (resp.data?.success) {
                        token.add(resp.data?.access.full, resp.data?.access.expire_in_minutes);
                        useAppStore().updateAppUser(resp.data.user);
                        this.$router.push({ name: 'app.home' });
                    } else {
                        this.formLogin.errors = resp.data?.errors;
                    }
                },
                finally: () => {
                    this.formLogin.submitting = false;
                }
            });
        }
    }
}

</script>