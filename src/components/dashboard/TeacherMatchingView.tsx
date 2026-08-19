"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserX, Clock } from "lucide-react";
import { matchingAPI, type TeacherOfferItem } from "@/lib/api";

export default function TeacherMatchingView() {
  const [offers, setOffers] = useState<TeacherOfferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadOffers();
  }, []);

  async function loadOffers() {
    try {
      const res = await matchingAPI.getTeacherOffers();
      setOffers(res.data);
    } catch {
      // API not available
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(offerId: string) {
    setActionLoading(offerId);
    try {
      await matchingAPI.acceptOffer(offerId);
      setOffers((prev) =>
        prev.map((o) => (o.id === offerId ? { ...o, status: "accepted" } : o))
      );
    } catch {
      // handle error
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDecline(offerId: string) {
    setActionLoading(offerId);
    try {
      await matchingAPI.declineOffer(offerId);
      setOffers((prev) => prev.filter((o) => o.id !== offerId));
    } catch {
      // handle error
    } finally {
      setActionLoading(null);
    }
  }

  const pending = offers.filter((o) => o.status === "pending");
  const accepted = offers.filter((o) => o.status === "accepted");

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 pt-20 max-w-4xl mx-auto">
        <div className="flex items-center justify-center pt-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 pt-20 pb-24 md:pb-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
          Student Match Requests
        </h1>
        <p className="text-slate-500 mt-1">
          Students whose learning patterns are compatible with your teaching style
        </p>
      </div>

      {/* Pending Requests */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          Pending Requests ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">No pending requests</p>
              <p className="text-slate-400 text-sm mt-1">
                Students will appear here when they find you as a compatible match
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pending.map((offer) => (
              <Card key={offer.id} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{offer.student_name}</p>
                      <p className="text-sm text-slate-500">
                        Compatibility: {Math.round(offer.compatibility_score * 100 / 5.5)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDecline(offer.id)}
                      disabled={actionLoading === offer.id}
                    >
                      <UserX className="w-4 h-4 mr-1" /> Decline
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleAccept(offer.id)}
                      disabled={actionLoading === offer.id}
                    >
                      <UserCheck className="w-4 h-4 mr-1" /> Accept
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Accepted Students */}
      {accepted.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            Connected Students ({accepted.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {accepted.map((offer) => (
              <Card key={offer.id} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{offer.student_name}</p>
                    <p className="text-sm text-emerald-600">
                      {Math.round(offer.compatibility_score * 100 / 5.5)}% match
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
