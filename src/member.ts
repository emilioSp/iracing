import { storage } from '../storage.js';
import { API_BASE_URL } from './constant.js';

interface MemberResponse {
  link: string;
}

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
  const store = storage.getStore();
  if (!store) {
    throw new Error('Storage context not found');
  }

  const { authCookie } = store;
  const headers = new Headers();
  headers.append('Cookie', authCookie);

  const response = await fetch(
    'https://members-ng.iracing.com/data/member/get?include_licenses=true&cust_ids=900937',
    {
      method: 'GET',
      headers,
      redirect: 'follow',
    },
  ).then((response) => response.json()) as MemberResponse;

  const data = await fetch(response.link).then((response) => response.json()) as MemberData;
  return data;
}; 