export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  photo?: string;
  linkedin?: string;
  email?: string;
}

const API_URL = 'http://localhost:8000/api/team/';

export async function getTeam(): Promise<TeamMember[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Erreur lors du chargement de l\'équipe');
  return await res.json();
}

export async function addTeamMember(member: Partial<TeamMember>): Promise<TeamMember> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(member),
  });
  if (!res.ok) throw new Error('Erreur lors de l\'ajout');
  return await res.json();
}

export async function updateTeamMember(id: number, member: Partial<TeamMember>): Promise<TeamMember> {
  const res = await fetch(`${API_URL}${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(member),
  });
  if (!res.ok) throw new Error('Erreur lors de la modification');
  return await res.json();
}

export async function deleteTeamMember(id: number): Promise<void> {
  const res = await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erreur lors de la suppression');
}
