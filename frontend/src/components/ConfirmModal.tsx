type ConfirmModalProps = {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel }: ConfirmModalProps) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={onCancel}>
    <section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onMouseDown={(event) => event.stopPropagation()}>
      <p className="eyebrow">CONFIRM ACTION</p>
      <h2 id="confirm-title">{title}</h2>
      <p className="muted">{message}</p>
      <div className="modal-actions">
        <button className="ghost-button" type="button" onClick={onCancel}>Cancel</button>
        <button className="danger-action" type="button" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </section>
  </div>
}
