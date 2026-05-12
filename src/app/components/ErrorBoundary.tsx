import { useRouteError, isRouteErrorResponse, Link } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage: string;
  let errorStatus: string | number = "Error";

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage =
      error.statusText || error.data?.message || "An error occurred";
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = "An unexpected error occurred";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">
            {errorStatus}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-8">{errorMessage}</p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-block w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="inline-block w-full px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reload Page
          </button>
        </div>

        {error instanceof Error && error.stack && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              Error Details
            </summary>
            <pre className="mt-4 p-4 bg-gray-100 rounded-lg text-xs overflow-auto max-h-96">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
