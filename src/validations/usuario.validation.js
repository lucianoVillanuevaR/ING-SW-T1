import Joi from 'joi';
const validacion = Joi.string().trim().min(1).max(100);
//para el usuario
const crearUsuarioSchema = Joi.object({
    nombre: validacion.required().messages({
        'any.required': 'El nombre es obligatorio',
        'string.empty': 'El nombre no puede estar vacío'
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'El email es obligatorio',
        'string.email': 'El email debe tener un formato válido',
        'string.empty': 'El email no puede estar vacío'
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
});
const validacionMiddleware = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: 'Error de validación',
                errors: error.details.map(d => ({
                    field: d.path.join('.'),
                    message: d.message
                }))
            });
        }
        req.body = value;
        next();
    };
};

export const validarCrearUsuario = validacionMiddleware(crearUsuarioSchema);
export { crearUsuarioSchema };
