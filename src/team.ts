import { API_BASE_URL } from './constant.js';
import { fetchData } from './repository/api.js';

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

export const team = async (teamId?: number): Promise<TeamData> => {
  const id = teamId ?? 364887; // Use provided ID or default to 364887
  const team = await fetchData(`${API_BASE_URL}/team/get?team_id=${id}`);
  return team as TeamData;
};
