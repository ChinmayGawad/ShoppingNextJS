import { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    
    useEffect(() => {
      // Check if we're on the client side
      if (typeof window !== 'undefined') {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin && router.pathname !== '/admin/login') {
          router.replace('/admin/login');
        }
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth; 