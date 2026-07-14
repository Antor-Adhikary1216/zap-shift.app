import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

const ErrorPage = () => {
  const error = useRouteError()
  const isNotFound = !error || (isRouteErrorResponse(error) && error.status === 404)

  return (
    <main className="min-h-screen bg-[#171717]">
      <section className="flex min-h-screen flex-col items-center justify-center rounded-[28px] bg-white px-5 py-12 text-center sm:rounded-[32px]">
        <div className="relative h-[255px] w-[278px] overflow-hidden sm:h-[340px] sm:w-[370px]" aria-hidden="true">
          <div
            className="absolute left-0 top-0 h-[340px] w-[370px] origin-top-left scale-75 bg-no-repeat sm:scale-100"
            style={{
              backgroundImage: "url('/error-page-reference.png')",
              backgroundPosition: '-570px -50px',
              backgroundSize: '1500px 680px',
            }}
          />
        </div>

        <h1 className="mt-5 text-5xl font-black tracking-tight text-[#1d1d1d] sm:mt-8 sm:text-6xl">
          {isNotFound ? 'Error 404' : 'Something went wrong'}
        </h1>

        <p className="mt-4 max-w-md text-base leading-7 text-[#606060] sm:text-lg">
          {isNotFound
            ? 'The page you are looking for could not be found.'
            : 'We could not load this page. Please return home and try again.'}
        </p>

        <Link
          to="/"
          replace
          className="btn mt-8 h-14 rounded-xl border-[#c5ed58] bg-[#c5ed58] px-8 text-lg font-bold text-[#1d1d1d] shadow-none hover:border-[#b7df49] hover:bg-[#b7df49] sm:mt-10"
        >
          Go Home
        </Link>
      </section>
    </main>
  )
}

export default ErrorPage
