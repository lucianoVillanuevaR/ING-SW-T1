// src/controllers/profile.controller.js
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { updateUserById, deleteUserById } from "../services/user.service.js";

export function getPublicProfile(req, res) {
  handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export function getPrivateProfile(req, res) {
  const user = req.user;
  handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
    message: `¡Hola, ${user.email}! Este es tu perfil privado. Solo tú puedes verlo.`,
    userData: user,
  });
}

// PATCH 
export async function updatePrivateProfile(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return handleErrorClient(res, 401, "Token inválido o sin id de usuario");

    const { email, password, id, ...rest } = req.body || {};
    if (Object.keys(rest).length > 0) {
      return handleErrorClient(res, 400, "Solo se permite modificar email y/o password");
    }
    if (!email && !password) {
      return handleErrorClient(res, 400, "Debes enviar email y/o password");
    }

    const updated = await updateUserById(userId, { email, password });
    handleSuccess(res, 200, "Perfil actualizado exitosamente", updated);
  } catch (error) {
    if (error.code === "23505") {
      return handleErrorClient(res, 409, "El email ya está registrado");
    }
    if (error.message === "Usuario no encontrado") {
      return handleErrorClient(res, 404, "Usuario no encontrado");
    }
    handleErrorServer(res, 500, "Error al actualizar el perfil", error.message);
  }
}

// DELETE 
export async function deletePrivateProfile(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return handleErrorClient(res, 401, "Token inválido o sin id de usuario");

    await deleteUserById(userId);
    handleSuccess(res, 200, "Cuenta eliminada exitosamente", { id: userId });
  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      return handleErrorClient(res, 404, "Usuario no encontrado");
    }
    handleErrorServer(res, 500, "Error al eliminar la cuenta", error.message);
  }
}
