'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { clanAPI } from '@/services/api';

interface EventMessage {
  id: number;
  clan_id: string;
  event: 'CLAN_JOIN' | 'CLAN_LEAVE';
  template: string;
  created_at: string;
  updated_at: string;
}

interface ClanDetail {
  id: string;
  clan_name: string;
  welcome_channel_id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  event_messages: EventMessage[];
}

function ClanDetailContent({ clanId }: { clanId: string }) {
  const router = useRouter();
  const [clan, setClan] = useState<ClanDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchClanDetail = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await clanAPI.getClan(clanId);
        
        if (response.success && response.data) {
          setClan(response.data);
        } else {
          setError(response.message || 'Không thể tải thông tin clan');
        }
      } catch (error: unknown) {
        console.error('Error fetching clan detail:', error);
        setError('Lỗi kết nối server');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClanDetail();
  }, [clanId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEditTemplate = (messageId: number, currentTemplate: string) => {
    setEditingMessageId(messageId);
    setEditingTemplate(currentTemplate);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingTemplate('');
  };

  const handleSaveTemplate = async () => {
    if (!editingMessageId || !editingTemplate.trim()) return;

    try {
      setIsUpdating(true);
      const response = await clanAPI.updateTemplateMessage(editingMessageId, editingTemplate.trim());
      
      if (response.success) {
        // Cập nhật local state
        if (clan) {
          const updatedMessages = clan.event_messages.map(msg => 
            msg.id === editingMessageId 
              ? { ...msg, template: editingTemplate.trim(), updated_at: new Date().toISOString() }
              : msg
          );
          setClan({ ...clan, event_messages: updatedMessages });
        }
        setEditingMessageId(null);
        setEditingTemplate('');
      } else {
        setError(response.message || 'Không thể cập nhật template');
      }
    } catch (err) {
      console.error('Error updating template:', err);
      setError('Có lỗi xảy ra khi cập nhật template');
    } finally {
      setIsUpdating(false);
    }
  };

  const getEventTypeText = (event: string) => {
    switch (event) {
      case 'CLAN_JOIN':
        return 'Tham gia clan';
      case 'CLAN_LEAVE':
        return 'Rời clan';
      default:
        return event;
    }
  };

  const getEventTypeColor = (event: string) => {
    switch (event) {
      case 'CLAN_JOIN':
        return 'bg-green-100 text-green-800';
      case 'CLAN_LEAVE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin clan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">Lỗi</h1>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!clan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy thông tin clan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {clan.clan_name}
                </h1>
                <p className="text-gray-600">Chi tiết clan</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Clan Info */}
            <div className="lg:col-span-1">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">
                          {clan.clan_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {clan.clan_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Clan ID: {clan.id}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Welcome Channel ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">{clan.welcome_channel_id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Owner ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">{clan.owner_id}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Event Messages */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Event Messages
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Các template tin nhắn tự động cho clan này
                  </p>
                </div>
                
                {clan.event_messages.length === 0 ? (
                  <div className="px-4 py-5 sm:px-6">
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có event messages</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Clan này chưa có template tin nhắn tự động nào.
                      </p>
                    </div>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {clan.event_messages
                      .sort((a, b) => {
                        // Sắp xếp theo thứ tự: CLAN_JOIN trước, CLAN_LEAVE sau
                        const order = { 'CLAN_JOIN': 0, 'CLAN_LEAVE': 1 };
                        return order[a.event] - order[b.event];
                      })
                      .map((message) => (
                      <li key={message.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(message.event)}`}>
                                {getEventTypeText(message.event)}
                              </span>
                              {editingMessageId !== message.id && (
                                <button
                                  onClick={() => handleEditTemplate(message.id, message.template)}
                                  className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                                >
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Chỉnh sửa
                                </button>
                              )}
                            </div>
                            <div className="mt-2">
                              {editingMessageId === message.id ? (
                                <div className="space-y-3">
                                  <div className="space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        {message.event !== 'CLAN_LEAVE' && (
                                          <button
                                            type="button"
                                            onClick={() => setEditingTemplate(editingTemplate + '{user}')}
                                            className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                                            title="Chèn tên người dùng"
                                            disabled={editingTemplate.includes('{user}')}
                                          >
                                            <span className="text-blue-600 font-mono disabled:text-gray-400">{'{user}'}</span>
                                          </button>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => setEditingTemplate(editingTemplate + '{clan}')}
                                          className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                                          title="Chèn tên clan"
                                          disabled={editingTemplate.includes('{clan}')}
                                        >
                                          <span className="text-blue-600 font-mono disabled:text-gray-400">{'{clan}'}</span>
                                        </button>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      💡 Click vào các button trên để tự động chèn biến vào template
                                    </div>
                                    <textarea
                                      value={editingTemplate}
                                      onChange={(e) => setEditingTemplate(e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm font-mono text-gray-900 bg-white"
                                      rows={4}
                                      placeholder="Nhập template tin nhắn..."
                                    />
                                  </div>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={handleSaveTemplate}
                                      disabled={isUpdating || !editingTemplate.trim()}
                                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                      {isUpdating ? (
                                        <>
                                          <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                          Đang lưu...
                                        </>
                                      ) : (
                                        <>
                                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                          Lưu
                                        </>
                                      )}
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      disabled={isUpdating}
                                      className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                                    >
                                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                      Hủy
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md font-mono">
                                  {message.template}
                                </p>
                              )}
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              Tạo: {formatDate(message.created_at)}
                              {message.updated_at !== message.created_at && (
                                <span className="ml-2">• Cập nhật: {formatDate(message.updated_at)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ClanDetailPage({ params }: { params: { id: string } }) {
  return (
    <ProtectedRoute>
      <ClanDetailContent clanId={params.id} />
    </ProtectedRoute>
  );
}
