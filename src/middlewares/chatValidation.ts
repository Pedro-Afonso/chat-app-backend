import { body, ValidationChain } from 'express-validator'

const createGroupChatValidation = (): ValidationChain[] => {
  return [
    body('users')
      .not()
      .isEmpty()
      .withMessage('Por favor, preencha todos os campos.'),
    body('name')
      .not()
      .isEmpty()
      .withMessage('Por favor, preencha todos os campos.')
  ]
}
const renameGroupChatValidation = (): ValidationChain[] => {
  return [
    body('newChatName')
      .not()
      .isEmpty()
      .withMessage('Por favor, preencha todos os campos.')
  ]
}

export { createGroupChatValidation, renameGroupChatValidation }
