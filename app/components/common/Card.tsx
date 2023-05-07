export type CardProps = {
  title?: string | undefined;
  className?: string | undefined;
  children?: JSX.Element | undefined;
};

export const Card: React.FC<CardProps> = ({ title, children, className }) => (
  <div className={`card bg-base-100 shadow-xl ${className}`}>
    <div className='card-body'>
      <h3 className='card-title'>{title}</h3>
      {children}
    </div>
  </div>
);
