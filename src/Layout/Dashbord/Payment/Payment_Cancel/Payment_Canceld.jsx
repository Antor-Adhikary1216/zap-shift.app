import { Link } from 'react-router'

const PaymentCancelled = () => {
    return (
        <div className="m-4 max-w-xl rounded-xl bg-white p-5 text-center shadow-sm sm:m-6 sm:p-8">
            <h2 className="text-3xl font-semibold text-amber-600">Payment cancelled</h2>
            <p className="mt-3 text-gray-600">No payment was taken. You can try again when you are ready.</p>
            <Link to="/dashbord/my-parcels" className="btn btn-neutral mt-6">
                Back to my parcels
            </Link>
        </div>
    )
}

export default PaymentCancelled
