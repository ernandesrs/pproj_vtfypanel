<template>
  <actions-bar bar-title="Meu perfil"></actions-bar>

  <v-row class="justify-center pa-8">
    <v-col cols="12" sm="10" lg="3" class="text-center">
      <v-avatar size="175">
        <v-img v-if="data?.photo_url" :src="data?.photo_url"></v-img>
        <div v-else class="text-h2 font-weight-bold w-100 h-100 d-flex justify-center align-center">
          {{ data?.first_name[0] }}{{ data?.last_name[0] }}
        </div>
      </v-avatar>
      <div class="py-3">
        <confirmation-button v-if="data?.photo_url" icon="mdi-trash-can-outline" text="Excluir foto" color="red"
          size="small" dialog-title="Excluir sua foto?" dialog-text="A foto não poderá ser recuperada."
          :confirm-callback="methodDeleteUserPhoto"></confirmation-button>
        <v-file-input @update:model-value="methodUploadUserPhoto" v-model="photoUpload.photo" v-else
          accept="image/png, image/jpeg, image/bmp" placeholder="Enviar foto" prepend-icon="mdi-account" label="Foto"
          :error-messages="photoUpload.errors?.photo"></v-file-input>
      </div>
    </v-col>
    <v-col cols="12" sm="10" lg="6">
      <form-elem :data="data" :fields="[
        {
          type: 'text',
          label: 'Nome',
          vModel: 'first_name',
          sizes: {
            sm: '6'
          }
        },
        {
          type: 'text',
          label: 'Sobrenome',
          vModel: 'last_name',
          sizes: {
            sm: '6'
          }
        },
        {
          type: 'text',
          label: 'Usuário',
          vModel: 'username',
          sizes: {
            sm: '6'
          }
        },
        {
          type: 'select',
          label: 'Gênero',
          vModel: 'gender',
          sizes: {
            sm: '6'
          },
          items: [
            {
              text: 'Masculino',
              value: 'm'
            },
            {
              text: 'Feminino',
              value: 'f'
            },
            {
              text: 'Não definir',
              value: 'n'
            }
          ]
        },
        {
          type: 'email',
          label: 'Email',
          vModel: 'email',
          sizes: {
          }
        },
        {
          type: 'password',
          label: 'Senha',
          vModel: 'password',
          sizes: {
            sm: '6'
          }
        },
        {
          type: 'password',
          label: 'Confirmar senha',
          vModel: 'password_confirmation',
          sizes: {
            sm: '6'
          }
        },
      ]" :submit-button="{
  text: 'Atualizar perfil'
}" :submit-options="{
  action: '/me/update',
  method: 'put',
  success: {
    title: 'Perfil atualizado!',
    message: this.data.first_name + ', seu perfil foi atualizado com sucesso!'
  }
}"></form-elem>
    </v-col>
  </v-row>
</template>

<script>

import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import axios from '@/plugins/axios';
import alert from '@/services/alert';
import ActionsBar from '@/layouts/default/ActionsBar.vue';
import ConfirmationButton from '@/components/ConfirmationButton.vue';
import FormElem from '@/components/FormElem.vue';

export default {
  components: { ActionsBar, ConfirmationButton, FormElem },
  data() {
    return {
      data: {},
      photoUpload: {
        uploading: false,
        photo: null,
        errors: {}
      }
    };
  },
  created() {
    useAppStore().updateBreadcrumbs([
      {
        title: "Home",
        disabled: false,
        to: { name: "app.home" }
      },
      {
        title: "Perfil",
        disabled: true,
        to: { name: "app.profile" }
      }
    ]);

    this.data = useUserStore().getUser;
  },
  methods: {
    methodDeleteUserPhoto() {
      return axios.req({
        action: '/me/photo-delete',
        method: 'delete',
        success: () => {
          alert.addWarning('Sua foto foi excluída!', 'Excluída!');
          this.data.photo_url = null;
        }
      })
    },
    methodUploadUserPhoto(event) {
      let data = new FormData();

      data.append('photo', event[0]);

      this.photoUpload.uploading = true;
      return axios.req({
        action: '/me/photo-upload',
        method: 'post',
        data: data,
        success: (resp) => {
          alert.addInfo('Sua foto de perfil foi atualizada!', 'Foto atualizada!');
          this.data.photo_url = resp.data.user.photo_url;
          useUserStore().updateUser(resp.data.user);
        },
        fail: (resp) => {
          this.photoUpload.errors = resp.response.data?.errors;
        },
        finally: () => {
          this.photoUpload.uploading = false;
        }
      })
    }
  }
}

</script>