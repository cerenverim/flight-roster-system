# Generated by Django 5.0.6 on 2024-05-25 09:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Passenger',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('age', models.IntegerField()),
                ('gender', models.CharField(max_length=100)),
                ('nationality', models.CharField(max_length=255)),
                ('flight_id', models.CharField(max_length=6)),
                ('seat_no', models.IntegerField(blank=True, null=True)),
                ('seat_type', models.IntegerField()),
                ('affiliated_passenger', models.ManyToManyField(to='passenger_information.passenger')),
            ],
        ),
        migrations.CreateModel(
            name='PlacedPassenger',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('seat_no', models.IntegerField()),
                ('passenger', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, to='passenger_information.passenger')),
            ],
        ),
    ]