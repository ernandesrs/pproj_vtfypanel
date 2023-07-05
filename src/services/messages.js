const errors = {
    // all
    InvalidDataException: 'Um ou mais dados informados são inválidos.',
    NotFoundException: 'Recurso não encontrado.',
    UnauthorizedException: 'Você não possui autorização.',
    UnauthorizedActionException: 'Você não possui autorização para esta ação.',
    NotHaveAdminPanelAcessException: 'Não possui acesso ao painel administrativo.',

    // auth
    LoginFailException: 'E-mail e/ou senha inválidos ou não existem.',
    VerificationTokenInvalidException: 'Token de verificação é inválido. Acesse sua conta e solicite um novo link.',
    UpdatePasswordTokenInvalidException: 'Token de recuperação é inválido.',

    // admin
    HasDependentsException: 'Há outros recursos que dependem deste.',

    // dash
    InvalidCreditCardException: 'Cartão de crédito inválido.',
    HasActiveSubscriptionException: 'Você tem uma assinatura ativa.',
    RefundPaymentFailException: 'Falha ao estornar.',
    RefundedPaymentException: 'Pagamento estornado.',
    RegisterCardAttemptsLimitException: 'Limite de tentativas de registro atingido.',

    RefusedPaymentException: 'Pagamento recusado.',
    PaymentFailException: 'Falha no pagamento.',
    ChargebackPaymentException: 'Pagamento retornado.'
};

export default {
    get: (error) => {
        return errors[error] ?? 'Houve um erro inesperado, entre em contato conosco.'
    }
};