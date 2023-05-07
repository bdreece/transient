import { Link } from '@remix-run/react';

const Index: React.FC = () => (
  <div className='hero min-h-screen'>
    <div className='hero-content relative text-center z-10'>
      <div className='max-w-md md:max-w-lg'>
        <h1 className='text-5xl font-bold'>
          Basically Snapchat, but for music
        </h1>
        <p className='pt-6'>
          Welcome to <b>transient</b>, a temporary audio file-sharing service.
          With transient, you can upload one or more audio files and fill out
          their respective metadata fields, and then assign this track a variety
          of expiration rules.
        </p>
        <p className='pt-6'>
          Currently, you can assign a track <i>play-based</i> and{' '}
          <i>date-based</i> expiration rules. The play-based rule type will
          allow a specified maximum number of streams before the file is
          removed. The date-based rule type will evict the track after the
          specified date has passed.
        </p>
        <p className='py-6'>Click the button below to upload a track now!</p>
        <Link
          className='btn btn-primary'
          to='/upload'
        >
          Get Started
        </Link>
      </div>
    </div>
    <div className='relative inset-0 h-full w-full overflow-x-clip'>
      <svg
        className='h-full'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 1440 320'
      >
        <path
          fill='hsl(var(--p))'
          fill-opacity='0.2'
          d='M0,128L84.7,192L169.4,128L254.1,224L338.8,192L423.5,192L508.2,256L592.9,288L677.6,256L762.4,160L847.1,192L931.8,224L1016.5,192L1101.2,288L1185.9,0L1270.6,32L1355.3,64L1440,288L1440,320L1355.3,320L1270.6,320L1185.9,320L1101.2,320L1016.5,320L931.8,320L847.1,320L762.4,320L677.6,320L592.9,320L508.2,320L423.5,320L338.8,320L254.1,320L169.4,320L84.7,320L0,320Z'
        ></path>
      </svg>
    </div>
  </div>
);

export default Index;
