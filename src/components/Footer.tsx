export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="flex items-center justify-center py-1 h-6">
      <div>
        <p className="text-tiny">
          ©
          {' '}
          {currentYear}
          {' '}
          LineBank FEPxBXI. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
