import { Link } from 'react-router'

const PaymentCancelled = () => {
    return (
        <div className="mx-3 my-4 max-w-xl rounded-xl bg-white p-5 text-center shadow-sm sm:mx-auto sm:my-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-amber-600 sm:text-3xl">Payment cancelled</h2>
            <p className="mt-3 text-gray-600">No payment was taken. You can try again when you are ready.</p>
            <Link to="/dashbord/my-parcels" className="btn btn-neutral mt-6 min-h-11 w-full sm:w-auto">
                Back to my parcels
            </Link>
        </div>
    )
}

export default PaymentCancelled
