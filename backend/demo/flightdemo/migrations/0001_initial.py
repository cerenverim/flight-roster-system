# Generated by Django 4.2.11 on 2024-03-28 10:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Crew',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('attendant_id', models.CharField(max_length=255)),
                ('attendant_info', models.TextField()),
                ('attendant_type', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Flight',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('flight_number', models.CharField(max_length=255)),
                ('flight_info', models.TextField()),
                ('flight_source', models.CharField(max_length=255)),
                ('flight_dest', models.CharField(max_length=255)),
                ('vehicle_type', models.CharField(max_length=255)),
                ('shared_flight', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='FlightMenu',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dishes', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Passenger',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('age', models.IntegerField()),
                ('gender', models.CharField(max_length=100)),
                ('nationality', models.CharField(max_length=255)),
                ('seat_type', models.CharField(max_length=100)),
                ('seat_info', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=255)),
                ('password', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='FlightRoster',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('crew', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='flightdemo.crew')),
                ('flight', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='flightdemo.flight')),
            ],
        ),
        migrations.CreateModel(
            name='FlightCrew',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pilot_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='flightdemo.user')),
            ],
        ),
    ]
