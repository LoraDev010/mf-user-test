interface Props {
  error: Error
}

export default function ErrorFallback({ error }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-2">
      <p className="text-text-secondary text-sm font-body">Algo salió mal</p>
      <p className="text-brand font-mono text-xs opacity-70">{error.message}</p>
    </div>
  )
}
