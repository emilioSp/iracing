import { fetchData } from "./repository/api.js";
import { API_BASE_URL } from "./constant.js";

interface License {
  category_id: number;
  category: string;
  category_name: string;
  license_level: number;
  safety_rating: number;
  cpi: number;
  tt_rating: number;
  mpr_num_races: number;
  color: string;
  group_name: string;
  group_id: number;
  pro_promotable: boolean;
  seq: number;
  mpr_num_tts: number;
}

interface MemberData {
  members: Array<{
    licenses: License[];
  }>;
}

export const member = async (): Promise<MemberData> => {
  const member = await fetchData(`${API_BASE_URL}/member/get?include_licenses=true&cust_ids=900937`);
  console.log(member);
  return member as MemberData;
}; 
