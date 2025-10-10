import { motion } from "framer-motion";
import "../modal/Modal.css";

export function ConfirmModal({
  show,
  title = "Confirmação",
  message,
  onConfirm,
  onCancel,
}) {
  if (!show) return null;

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="modal-card"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <h5>{title}</h5>
        <p>{message}</p>
        <div className="modal-actions">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="btn btn-danger"
            onClick={onConfirm}
          >
            Excluir
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancelar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
