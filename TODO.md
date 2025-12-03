
# TODO: Add SMS Notifications for Weather Updates and Alerts

## Pending Tasks
- [x] Add `smsEnabled` boolean to `AlarmSettings` interface in `src/lib/weatherAlarm.ts`
- [x] Create `sendWeatherAlertSMS` function in `src/lib/smsService.ts` to format and send weather alerts via SMS
- [x] Modify `triggerWeatherAlarm` in `src/lib/weatherAlarm.ts` to accept optional user phone number and send SMS if enabled
- [x] Update `src/pages/Alerts.tsx` to retrieve user phone from AuthContext and pass it to `triggerWeatherAlarm`
- [x] Add SMS settings to alarm settings UI in Alerts.tsx
- [ ] Test SMS sending with weather alerts
- [ ] Verify SMS settings integration in UI (if needed)
