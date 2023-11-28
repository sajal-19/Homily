export default function Image({src,...rest}) {
    src = src && src.includes('https://')
      ? src
      : 'https://homily-api1.vercel.app/uploads/'+src;
    return (
      <img {...rest} src={src} alt={''} />
    );
  }
