import { Outlet } from 'react-router-dom'

export function Content() {
  return (
    <main className="p-10 md:p-2 flex-grow content-text">
      <div className="p-6">
        <Outlet />
      </div>
    </main>
  )
}
