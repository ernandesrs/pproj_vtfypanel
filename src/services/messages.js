const errors = {
    // all
    InvalidDataException: 'Um ou mais dados informados são inválidos.',
    NotFoundException: 'Recurso não encontrado.',

    // auth
    LoginFailException: 'E-mail e/ou senha inválidos ou não existem.',
    VerificationTokenInvalidException: 'Token de verificação é inválido. Acesse sua conta e solicite um novo link.',
};

export default {
    get: (error) => {
        return errors[error] ?? 'Houve um erro inesperado, entre em contato conosco.'
    }
};