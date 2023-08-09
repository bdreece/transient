import { Link } from '@remix-run/react';

const Index: React.FC = () => (
  <div className='hero relative isolate min-h-screen'>
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
  </div>
);

export default Index;
