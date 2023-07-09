const errors = {
    // all
    InvalidDataException: 'Um ou mais dados informados são inválidos',
    InvalidDataException_title: 'Dados inválidos',
    NotFoundException: 'O recurso solicitado não foi encontrado',
    NotFoundException_title: 'Não encontrado',
    UnauthorizedException: 'Você não possui autorização',
    UnauthorizedException_title: 'Não autorizado',
    UnauthorizedActionException: 'Você não possui autorização para esta ação',
    UnauthorizedActionException_title: 'Ação não autorizada',
    NotHaveAdminPanelAcessException: 'Não possui acesso ao painel administrativo',
    NotHaveAdminPanelAcessException_title: 'Sem acesso',

    // auth
    LoginFailException: 'E-mail e/ou senha inválidos ou não existem',
    LoginFailException_title: 'Falha no login',
    VerificationTokenInvalidException: 'Token de verificação é inválido. Acesse sua conta e solicite um novo link',
    VerificationTokenInvalidException_title: 'Token inválido',
    UpdatePasswordTokenInvalidException: 'Token de recuperação é inválido',
    UpdatePasswordTokenInvalidException_title: 'Token inválido',

    // admin
    HasDependentsException: 'Há outros recursos que dependem e estão vinculados a este recurso',
    HasDependentsException_title: 'Impossível excluir',

    // dash
    InvalidCreditCardException: 'O cartão de crédito informado é inválido',
    InvalidCreditCardException_title: 'Cartão inválido',
    HasActiveSubscriptionException: 'Você já possui uma assinatura ativa',
    HasActiveSubscriptionException_title: 'Assinatura ativa',
    RefundPaymentFailException: 'Falha ao realizar o estorno',
    RefundPaymentFailException_title: 'Falha ao estornar',
    RefundedPaymentException: 'O estorno de pagamento foi efetuado com sucesso',
    RefundedPaymentException_title: 'Pagamento estornado',
    RegisterCardAttemptsLimitException: 'O limite de tentativas de cadastro de cartão por minuto foi atingido',
    RegisterCardAttemptsLimitException_title: 'Limite atingido',

    RefusedPaymentException: 'O pagamento foi recusado pela operadora',
    RefusedPaymentException_title: 'Pagamento recusado',
    PaymentFailException: 'Houve uma falha ao tentar realizar o pagamento',
    PaymentFailException_title: 'Falha no pagamento',
    ChargebackPaymentException: 'O pagamento foi retornado pela operadora',
    ChargebackPaymentException_title: 'Pagamento retornado'
};

export default {
    get: (error) => {
        return errors[error] ?? 'Houve um erro inesperado, entre em contato conosco.'
    },
    getTitle: (error) => {
        return errors[error + '_title'] ?? 'Houve um erro'
    }
};