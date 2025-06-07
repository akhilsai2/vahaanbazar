"use client"
import dynamic from 'next/dynamic';
import Loader from '../../components/loaders';

const BidLimitPage = dynamic(() => import('./bidLimt'), {loading: () => <Loader /> ,ssr: false });

export default function DashPage() {
  return ( 
      <BidLimitPage />
  );
}