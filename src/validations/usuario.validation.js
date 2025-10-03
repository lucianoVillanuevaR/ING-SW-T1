import Joi from 'joi';
const validacion = Joi.string().trim().min(1).max(100);
const crearUsuarioSchema = Joi.object({
  nombre: validacion.required().messages({
    'any.required': 'El nombre es obligatorio',
    'string.empty': 'El nombre no puede estar vacio'
  }),
  email: Joi.string().trim().lowercase().email({ tlds: { allow: false } })
    .required()
    .messages({
      'any.required': 'El email es obligatorio',
      'string.email': 'El email debe tener un formato valido',
      'string.empty': 'El email no puede estar vacio'
    }),
  apellido: validacion.required().messages({
    'any.required': 'El apellido es obligatorio',
    'string.empty': 'El apellido no puede estar vacío'
  }),
  password: Joi.string().min(5).required().messages({
    'any.required': 'La contrasena es obligatoria',
    'string.min': 'La contrasena debe tener al menos 5 caracteres',
    'string.empty': 'La contrasena no puede estar vacía'
  })
}).options({ abortEarly: false, allowUnknown: false });
const validacionMiddleware = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });
  if (error) {
    return res.status(400).json({
      message: 'Error de validación',
      errors: error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    });
  }
  req.body = value;
  next();
};
const ActualizarPerfil = crearUsuarioSchema
  .fork(['nombre', 'apellido'], () => Joi.forbidden().messages({
    'any.unknown': 'No se permite modificar este campo'
  }))
  .fork(['email', 'password'], (s) => s.optional())
  .or('email', 'password')
  .messages({ 'object.missing': 'Debes enviar al menos "email" o "password"' });
export const validarCrearUsuario = validacionMiddleware(crearUsuarioSchema);
export const validarUpdateProfile = validacionMiddleware(ActualizarPerfil);
export { crearUsuarioSchema };
