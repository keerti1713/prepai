'use client'
import { PayPalButtons, PayPalScriptProvider} from '@paypal/react-paypal-js'
import React from 'react'
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

function Upgrade() {
  const { user } = useUser();
  const router=useRouter();

  const onPaymentSuccess =async () => {
    try {
      const response = await axios.post('/api/update-membership', {
        email: user?.primaryEmailAddress?.emailAddress, 
        isMember: true,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), 
        nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), 
        status: "active"
      });
  
      alert("Payment successful! Membership upgraded.");
      router.push('/dashboard');
    } catch (error) {
      console.error("Error updating membership:", error.response?.data || error.message);
    }
  }
  return (
    
    <div>
      <h2 className='font-medium text-3xl'>Plans</h2>
      <p className='text-gray-500 '>Update your plan to generate more Courses.</p>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
          <div
            className="rounded-2xl border border-purple-900 p-6 ring-1 shadow-xs ring-purple-700 sm:order-last sm:px-8 lg:p-12 "
          >
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">
                Pro
                <span className="sr-only">Plan</span>
              </h2>

              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl"> 9$ </strong>

                <span className="text-sm font-medium text-gray-700">/month</span>
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-purple-700"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>

                <span className="text-gray-700">Generate Unlimited Courses</span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-purple-700"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>

                <span className="text-gray-700">Generate Unlimited Flashcards </span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-purple-700"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>

                <span className="text-gray-700">Generate Unlimited Quizzes </span>
              </li>
              </ul>
            
            <PayPalScriptProvider  options={{clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}}>
              <div className='mt-5'>
                <PayPalButtons 
                onApprove={()=>onPaymentSuccess()}
                onCancel={()=>console.log('Payment cancelled')}
                createOrder={(data,actions)=>{
                  return actions?.order?.create({
                    purchase_units:[
                      {
                        amount:{
                          value:9,
                          currency_code:'USD'
                        }
                      }
                    ]
                  })
                }}
                />
              </div>
            </PayPalScriptProvider>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6 shadow-xs sm:px-8 lg:p-12">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">
                Free
                <span className="sr-only">Plan</span>
              </h2>

              <p className="mt-2 sm:mt-4">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl"> 0$ </strong>

                <span className="text-sm font-medium text-gray-700">/month</span>
              </p>
            </div>

            <ul className="mt-6 space-y-2">
              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-purple-700"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>

                <span className="text-gray-700">Generate up to 5 courses</span>
              </li>

              <li className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-5 text-purple-700"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>

                <span className="text-gray-700">Limited Access to Generation</span>
              </li>
            </ul>

            <h2
              className="mt-8 block rounded-full border border-purple-600 bg-white px-12 py-3 text-center text-sm font-medium text-purple-800 "
            >
              Free Plan
            </h2>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Upgrade