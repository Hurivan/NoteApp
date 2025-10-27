import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Lobby/Header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Plus, Edit, Trash } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AccountPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [projectsRes, ordersRes] = await Promise.all([
        axios.get(`${API}/projects`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/orders`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setProjects(projectsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await axios.delete(`${API}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Project deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="lobby min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="lobby min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Welcome, {user?.name}
            </h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          {/* Projects Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>My Projects</h2>
              <Button
                data-testid="create-new-project-button"
                onClick={() => navigate('/create')}
                className="bg-[#8B1E3F] hover:bg-[#6d1731] text-white"
              >
                <Plus className="mr-2" size={20} />
                New Project
              </Button>
            </div>

            {projects.length === 0 ? (
              <div data-testid="no-projects" className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-500 mb-4">No projects yet</p>
                <Button onClick={() => navigate('/create')} variant="outline">
                  Create your first book
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    data-testid={`project-card-${project.id}`}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <h3 className="font-semibold text-lg mb-2">{project.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">Pages: {project.config.page_count}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      {new Date(project.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        data-testid={`edit-project-${project.id}`}
                        onClick={() => navigate(`/app/${project.id}`)}
                        className="flex-1 bg-[#8B1E3F] hover:bg-[#6d1731] text-white"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        data-testid={`delete-project-${project.id}`}
                        onClick={() => deleteProject(project.id)}
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Orders Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>Order History</h2>
            
            {orders.length === 0 ? (
              <div data-testid="no-orders" className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        data-testid={`order-row-${order.id}`}
                        className="border-t hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        <td className="px-6 py-4 text-sm">{order.id.slice(0, 8)}</td>
                        <td className="px-6 py-4 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold">${order.total_price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}