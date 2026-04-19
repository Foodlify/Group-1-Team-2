import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';
import app from '../../../app';
import * as cartService from '../cart.services';

jest.mock('../cart.services');

const mockedCartService = cartService as jest.Mocked<typeof cartService>;

describe('Cart Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/cart/items', () => {
    it('should add an item to the cart', async () => {
      const mockResult = { id: 1, user_id: 1, status: 'active', items: [] };
      mockedCartService.addToCart.mockResolvedValue(mockResult as any);

      const response = await request(app)
        .post('/api/v1/cart/items')
        .send({ menuItemId: 2, quantity: 3 });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Item added to cart successfully");
      expect(response.body.data).toEqual(mockResult);
      expect(mockedCartService.addToCart).toHaveBeenCalledWith(1, 2, 3);
    });

    it('should return 400 for invalid quantities', async () => {
      const response = await request(app)
        .post('/api/v1/cart/items')
        .send({ menuItemId: -1, quantity: -5 });

      expect(response.status).toBe(400); 
    });
  });

  describe('GET /api/v1/cart', () => {
    it('should view the cart successfully', async () => {
      const mockResult = { cartId: 1, status: 'active', items: [], totalPrice: 0, itemCount: 0 };
      mockedCartService.viewCart.mockResolvedValue(mockResult as any);

      const response = await request(app).get('/api/v1/cart');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(mockedCartService.viewCart).toHaveBeenCalledWith(1); 
    });
  });

  describe('PUT /api/v1/cart', () => {
    it('should modify the cart properly', async () => {
      const mockResult = { id: 1, user_id: 1, status: 'active', items: [] };
      mockedCartService.modifyCart.mockResolvedValue(mockResult as any);

      const response = await request(app)
        .put('/api/v1/cart')
        .send({ menuItemId: 2, quantity: 5 });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Cart modified successfully");
      expect(mockedCartService.modifyCart).toHaveBeenCalledWith(1, 2, 5);
    });
  });

  describe('DELETE /api/v1/cart/items/:menuItemId', () => {
    it('should remove a single item from the cart', async () => {
      const mockResult = { id: 1, user_id: 1, status: 'active', items: [] };
      mockedCartService.removeItem.mockResolvedValue(mockResult as any);

      const response = await request(app).delete('/api/v1/cart/items/2');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Item removed from cart successfully");
      expect(mockedCartService.removeItem).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('DELETE /api/v1/cart', () => {
    it('should clear the entire cart context', async () => {
      const mockResult = { id: 1, user_id: 1, status: 'active', items: [] };
      mockedCartService.clearCart.mockResolvedValue(mockResult as any);

      const response = await request(app).delete('/api/v1/cart');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Cart cleared successfully");
      expect(mockedCartService.clearCart).toHaveBeenCalledWith(1);
    });
  });
});