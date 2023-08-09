import dayjs from 'dayjs';

const year = dayjs().year();

export const Footer: React.FC = () => (
  <footer className='footer footer-center p-4 bg-base-300 text-base-content'>
    <div>
      <p>Copyright &copy; {year} <a href="https://bdreece.dev" rel="noreferrer" target="_blank">Brian Reece</a></p>
    </div>
  </footer>
);
