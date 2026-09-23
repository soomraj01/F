import { profileImage } from '../config/profile';

// This component shows the configured profile photo and falls back to initials until one is provided.
function ProfileAvatar({ className = '' }) {
  return <div className={`avatar ${className}`}>{profileImage ? <img src={profileImage} alt="Soom Raj" /> : 'SR'}</div>;
}

export default ProfileAvatar;
