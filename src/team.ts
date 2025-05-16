import { storage } from '../storage.js';
import { API_BASE_URL } from './constant.js';

interface TeamResponse {
  link: string;
}

interface Helmet {
  pattern: number;
  color1: string;
  color2: string;
  color3: string;
  face_type: number;
  helmet_type: number;
}

interface TeamMember {
  cust_id: number;
  display_name: string;
  helmet: Helmet;
  owner: boolean;
  admin: boolean;
}

interface TeamSuit {
  pattern: number;
  color1: string;
  color2: string;
  color3: string;
}

interface TeamTags {
  categorized: string[];
  not_categorized: string[];
}

interface TeamData {
  team_id: number;
  owner_id: number;
  team_name: string;
  created: string;
  hidden: boolean;
  message: string;
  about: string;
  url: string;
  roster_count: number;
  recruiting: boolean;
  private_wall: boolean;
  is_default: boolean;
  is_owner: boolean;
  is_admin: boolean;
  suit: TeamSuit;
  owner: TeamMember;
  tags: TeamTags;
  team_applications: unknown[];
  pending_requests: unknown[];
  is_member: boolean;
  is_applicant: boolean;
  is_invite: boolean;
  is_ignored: boolean;
  roster: TeamMember[];
}

export const team = async (): Promise<TeamData> => {
  const store = storage.getStore();
  if (!store) {
    throw new Error('Storage context not found');
  }

  const { authCookie } = store;
  const headers = new Headers();
  headers.append('Cookie', authCookie);

  const response = await fetch(`${API_BASE_URL}/team/get?team_id=364887`, {
    method: 'GET',
    headers,
    redirect: 'follow',
  });

  const body = await response.json() as TeamResponse;

  if (!response.ok) {
    throw new Error(JSON.stringify(body));
  }

  const data = await fetch(body.link).then((response) => response.json()) as TeamData;
  return data;
}; 