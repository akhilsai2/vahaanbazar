"use client"
import dynamic from 'next/dynamic';
import Loader from '../../components/loaders';

const BuySellPage = dynamic(() => import('./buy-sell'), {loading: () => <Loader /> ,ssr: false });

export default function DashPage() {
  return ( 
      <BuySellPage />
  );
}