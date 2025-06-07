"use client"
import dynamic from 'next/dynamic';
import Loader from '../../../components/loaders';

const PaymentHistory = dynamic(() => import('./paymentHistory'), {loading: () => <Loader /> ,ssr: false });

export default function DashPage() {
  return ( 
      <PaymentHistory />
  );
}