@extends('layouts.admin')

@section('admin-content')
 
    <div class="col">
        <div class="col-12">
            <router-view></router-view>
            {{-- <h2 class="mb-3">{{ _('Dashboard') }}</h2> --}}
        </div>
    </div>
    
@endsection