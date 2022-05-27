import ReactModal from "react-modal";
import style from "./Modal.module.css";

ReactModal.setAppElement("#root");

const Modal = ({ modalData, children, ...props }) => {
  let { id, name } = modalData;

  return (
    <ReactModal {...props}>
      <div className={style.modal__outer}>{children}</div>
    </ReactModal>
  );
};

export default Modal;
