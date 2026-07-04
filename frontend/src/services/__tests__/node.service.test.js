import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import NodeService from '../node.service';
import { guestDataApi } from '../../data/guestData';

vi.mock('axios');

describe('NodeService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('serves nodes from the in-memory guest store in guest mode', async () => {
    localStorage.setItem('user', JSON.stringify({ isGuest: true }));
    const response = await NodeService.getAllNodes();
    expect(response.data).toEqual(guestDataApi.getNodes());
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('filters guest nodes by type without hitting the API', async () => {
    localStorage.setItem('user', JSON.stringify({ isGuest: true }));
    const response = await NodeService.getNodesByType('factory');
    expect(response.data.length).toBeGreaterThan(0);
    expect(response.data.every((node) => node.type === 'factory')).toBe(true);
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('calls the API with the auth header for logged-in users', async () => {
    localStorage.setItem('user', JSON.stringify({ username: 'maria', token: 'jwt-123' }));
    axios.get.mockResolvedValue({ data: [{ id: 1 }] });

    const response = await NodeService.getAllNodes();

    expect(response.data).toEqual([{ id: 1 }]);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/nodes/'),
      expect.objectContaining({ headers: { Authorization: 'Bearer jwt-123' } })
    );
  });
});
