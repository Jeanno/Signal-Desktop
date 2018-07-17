#### With name and profile, verified

```jsx
<div style={{ backgroundColor: 'gray', color: 'white' }}>
  <ConversationTitle
    i18n={util.i18n}
    isVerified
    name="Someone 🔥 Somewhere"
    phoneNumber="(202) 555-0011"
    profileName="🔥Flames🔥"
  />
</div>
```

#### With name, not verified

```jsx
<div style={{ backgroundColor: 'gray', color: 'white' }}>
  <ConversationTitle
    i18n={util.i18n}
    name="Someone 🔥 Somewhere"
    phoneNumber="(202) 555-0011"
  />
</div>
```

#### Profile, no name

```jsx
<div style={{ backgroundColor: 'gray', color: 'white' }}>
  <ConversationTitle
    i18n={util.i18n}
    phoneNumber="(202) 555-0011"
    profileName="🔥Flames🔥"
  />
</div>
```

#### No name, no profile

```jsx
<div style={{ backgroundColor: 'gray', color: 'white' }}>
  <ConversationTitle i18n={util.i18n} phoneNumber="(202) 555-0011" />
</div>
```
