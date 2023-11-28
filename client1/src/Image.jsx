export default function Image({src,...rest}) {
    src = src && src.includes('https://')
      ? src
      : 'https://homily-api2.vercel.app/uploads/'+src;
    return (
      <img {...rest} src={src} alt={''} />
    );
  }
