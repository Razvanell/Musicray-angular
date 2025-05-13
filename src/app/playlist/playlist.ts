import { Track } from '../track/track';
import { User } from '../user/user';

export interface Playlist {
    id: number;
    name: string;
    user: User;
    tracks: Track[];
}