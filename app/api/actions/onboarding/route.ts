import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let role: string | null = null;
    let payload: Record<string, any> = {};

    if (contentType.includes('application/json')) {
      const body = await request.json();
      role = body.role;
      payload = body;
    } else {
      const formData = await request.formData();
      role = (formData.get('role') as string) || 'talent';
      payload = Object.fromEntries(formData.entries());
    }

    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (role === 'shop_owner') {
      const { data: existing } = await supabase
        .from('shop_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      if (existing) {
        return NextResponse.json({ success: true, redirect: '/shop-owner' });
      }
      const { error: shopError } = await supabase.from('shop_profiles').insert({
        user_id: user.id,
        shop_name: payload.shop_name || 'My Shop',
        business_type: payload.business_type || 'General Store',
        address: payload.address || null,
        city: payload.city || null,
        phone: payload.phone || null,
        years_in_operation: payload.years_in_operation ? Number(payload.years_in_operation) : null,
        delivery_radius_km: payload.delivery_radius_km ? Number(payload.delivery_radius_km) : 10,
        min_order_amount: payload.min_order_amount ? Number(payload.min_order_amount) : 0,
      });
      if (shopError) {
        return NextResponse.json({ error: shopError.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, redirect: '/shop-owner' });
    }

    // Talent onboarding (workforce model)
    const headline = payload.headline as string;
    const skillsString = payload.skills as string;
    const hourlyRate = payload.hourlyRate as string;
    const country = payload.country as string;
    const availability = (payload.availability as string) || 'available';

    const skills = skillsString ? skillsString.split(',').map((s) => s.trim()).filter(Boolean) : [];

    const worker_meta: Record<string, any> = {
      primaryOccupation: payload.primary_occupation || null,
      trade: payload.trade || null,
      experienceYears: payload.experience_years ? Number(payload.experience_years) : 0,
      serviceRadiusKm: payload.service_radius_km ? Number(payload.service_radius_km) : 10,
      ownVehicle: payload.own_vehicle === 'true' || payload.own_vehicle === true,
      ownTools: payload.own_tools === 'true' || payload.own_tools === true,
      emergencyAvailable: payload.emergency_available === 'true' || payload.emergency_available === true,
      canTravel: payload.can_travel !== 'false',
      maxTravelKm: payload.max_travel_km ? Number(payload.max_travel_km) : 25,
      languages: payload.languages ? (Array.isArray(payload.languages) ? payload.languages : [payload.languages]) : ['en', 'bn'],
      employmentTypes: payload.employment_types ? (Array.isArray(payload.employment_types) ? payload.employment_types : [payload.employment_types]) : ['one_time', 'hourly'],
      warrantyOffered: payload.warranty_offered || 'none',
      isBusiness: payload.is_business === 'true' || payload.is_business === true,
      businessName: payload.business_name || null,
      teamMember: payload.team_member === 'true' || payload.team_member === true,
    };

    const { error: updateError } = await supabase
      .from('talent_profiles')
      .upsert({
        id: user.id,
        headline,
        skills,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
        country,
        availability,
        primary_occupation: payload.primary_occupation || null,
        trade: payload.trade || null,
        experience_years: worker_meta.experienceYears,
        service_radius_km: worker_meta.serviceRadiusKm,
        own_vehicle: worker_meta.ownVehicle,
        own_tools: worker_meta.ownTools,
        emergency_available: worker_meta.emergencyAvailable,
        can_travel: worker_meta.canTravel,
        max_travel_km: worker_meta.maxTravelKm,
        languages: worker_meta.languages,
        employment_types: worker_meta.employmentTypes,
        warranty_offered: worker_meta.warrantyOffered,
        is_business: worker_meta.isBusiness,
        business_name: worker_meta.businessName,
        team_member: worker_meta.teamMember,
        worker_meta,
      });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    const completionFields = [headline, skills.length > 0, hourlyRate, country, payload.primary_occupation].filter(Boolean).length;
    const completionScore = Math.round((completionFields / 6) * 100);

    await supabase.from('talent_profiles').update({ completion_score: completionScore }).eq('id', user.id);

    return NextResponse.json({ success: true, redirect: '/talent-dashboard' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
