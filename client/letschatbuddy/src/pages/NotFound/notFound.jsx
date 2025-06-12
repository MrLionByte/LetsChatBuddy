import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black text-green-300 font-mono">
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] bg-cover bg-no-repeat z-[-1]" />

      <div className="absolute inset-0 z-0 bg-[repeating-linear-gradient(180deg,transparent_0,rgba(0,0,0,0.3)_50%,transparent_100%)] bg-[auto_4px]" />

      <div className="absolute inset-0 z-0 bg-[linear-gradient(0deg,transparent_0%,rgba(32,128,32,0.2)_2%,rgba(32,128,32,0.8)_3%,rgba(32,128,32,0.2)_3%,transparent_100%)] bg-no-repeat animate-scan" />

      <div className="relative flex flex-col items-center justify-center min-h-screen p-8 z-10">
        <h1 className="text-5xl mb-6">Error <span className="text-white">404</span></h1>
        <p className="mb-3 before:content-['>'] before:mr-2">
          The page you are looking for might have been removed, renamed, or is temporarily unavailable.
        </p>
        <p className="mb-3 before:content-['>'] before:mr-2">
          Please try to 
          <button className="mx-2 underline" onClick={() => navigate(-1)}>[Go Back]</button> 
          or 
          <button className="ml-2 underline" onClick={() => navigate('/')}>[Return Home]</button>.
        </p>
        <p className="before:content-['>'] before:mr-2">Good luck.</p>
      </div>
    </div>
  );
};

export default NotFound;
